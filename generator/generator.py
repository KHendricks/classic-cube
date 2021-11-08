import collections
import datetime
import glob
import itertools
import json
import os
from PIL import Image
import random
from dotenv import load_dotenv
from dotenv.main import dotenv_values
import requests

load_dotenv()


class Generator:
    """
    This class handles the creation of multiple images laying the
    various layers on top of each other. It expects the input directory
    to exist and the directoies must be in the order of which they
    will be placed. The ordering is handled be prepending the directory
    name with "#_" where the lower the number will be the first layer.

    This will output the images and json the the repsective folders in
    the output directory/

    If a directory is named "background" it will randomly select
    an image from the directory to use as the background.
    This is done because I do not want the background to be
    a unique characteristic of the image and if backgrounds
    are different that should not be a varying feature.

    Prereqs:
        output/ - directory must exist
        input/  - directory must exist
        input/* - must have the associated layer

    Once the tokens are generated the json file will have an
    image attribute keyed "image" with the string "REPLACE_ME"
    after uploading the images to a IPFS service the string
    "REPLACE_ME" will need to be replaced with the CID value.

    How To:
        python3 generate.py
        upload images to IPFS
        grab the CID
        enter CID to the prompt
    """

    def __init__(self):

        self.config = dotenv_values(".env")
        self._cleanup()

        self.dna = set()
        self.generation_count = 0
        self._set_layers()
        self._generate()
        # self._pin_files()

    def _cleanup(self):
        """
        Upon each run of this script the output directories
        will be cleaned up.
        """
        image_list = glob.glob(os.path.join("output/images/", "*"))
        json_list = glob.glob(os.path.join("output/json/", "*"))
        for x in image_list:
            os.remove(x)
        for x in json_list:
            os.remove(x)

    def _set_layers(self):
        """
        Grabs the files from the inputs directory and stores the
        file paths into an ordered dictionary.
        """
        ret_val = dict()

        base_dir = True
        for root, dirs, files in os.walk("input"):
            if base_dir:
                base_dir = False
                continue

            filepaths = []
            for file in files:
                filepaths.append("%s/%s" % (root, file))
            ret_val[root] = filepaths

        self.layers = collections.OrderedDict(sorted(ret_val.items()))

    def _generate(self):
        """
        Generates the images from the layer. The set_layers path
        must be ran prior to this. This function will create unique
        combinations of all the layers and ensure no duplicates are
        made. I.e. there will always at least be one difference from other images.
        """
        print("Generating images...")

        # Create a list of lists of the various layers
        ranges = []
        for key, value in self.layers.items():
            # do not add backgrounds to dna range
            if key != "input/background":
                ranges.append(value)


        for i in range(0, len(ranges)):
            random.shuffle(ranges[i])

        shuffled_ranges = []
        for x in itertools.product(*ranges):
            colors = {"Orange.png": 0, "Mint.png": 0, "Blue.png": 0, "Purple.png": 0, "Red.png": 0, "Yellow.png": 0}
            skip_iteration = False
            for item in x:
                colors[item.split("/")[2]] += 1
            
            for key, value in colors.items():
                if value >= 8:
                    print("Skipping... Using more than 9 of the same colors")
                    skip_iteration = True 
            
            if not skip_iteration: 
                shuffled_ranges.append(x)

            if len(shuffled_ranges) > 50000:
                break
        random.shuffle(shuffled_ranges)

        for dna in shuffled_ranges:
            if dna in self.dna:
                print("DNA already exists. Can not add")
            else:
                self.dna.add(dna)

                # TODO: Remove hard coded size
                base_layer = Image.new("RGBA", (600, 600))
                attributes = []
                for item in dna[0:]:
                    new_layer = Image.open(item)
                    base_layer.paste(new_layer, (0, 0), new_layer)
                    attributes.append(
                        {
                            "trait_type": item.split("/")[1][2:],
                            "value": item.split("/")[2].split(".")[0],
                        }
                    )

                # Grabs a random item from input/background and adds it to the token
                background_choice = random.choice(self.layers["input/background"])
                attributes.append(
                    {
                        "trait_type": "background",
                        "value": background_choice.split("/")[2].split(".")[0],
                    }
                )
                background_layer = Image.open(background_choice)
                background_layer.paste(base_layer, (0, 0), base_layer)
                base_layer = background_layer

                base_layer.save(
                    "output/images/%s.png" % self.generation_count, format="png"
                )

                # Create the json associated with the image
                data = dict()
                data["dna"] = hash(str(dna))
                data["name"] = "%s #%s" % (self.config["name"], self.generation_count)
                data["description"] = "This is the description"
                data["image"] = "ipfs://REPLACE_ME/%s.png" % self.generation_count
                data["date"] = round(datetime.datetime.utcnow().timestamp())
                data["attributes"] = attributes

                with open(
                    "output/json/%s" % self.generation_count, "w"
                ) as outfile:
                    json.dump(data, outfile)

                self.generation_count += 1

            if self.generation_count % 100 == 0:
                print("Currently made %s images..." % self.generation_count)

            if self.generation_count == 8192:
                break 

        print("Created %s unique images." % self.generation_count)

    def _update_cid(self, cid):
        """
        After the art has generated the images will need to be
        uploaded to an IPFS service. This function will
        wait until a CID is entered and then it will
        update the value to the json.
        """

        os.system('sed -i "s/REPLACE_ME/%s/" output/json/*' % cid)

    def _pin_files(self):
        """
        Call the javascript helper to pin data to pinata.cloud
        """
        if os.path.exists(".env"):
            os.system("cp .env util/.env")
        else:
            print(".env file does not exist.")

        print()
        print("Pinning images to pinata.cloud...")
        os.system("node util/pinImages.js")
        print("Finished pinning.")
        print()

        print("Updating JSON with CID...")
        with open("IpfsHash.txt", "r") as in_file:
            cid = in_file.read()
            self._update_cid(cid)
        print("Finished updating CID.")

        print()
        print("Pinning JSON to pinata.cloud...")
        os.system("node util/pinJson.js")
        print("Finished pinning.")
        print()

        os.system("rm util/.env")
        os.system("rm IpfsHash.txt")


if __name__ == "__main__":
    generator = Generator()
    pass
