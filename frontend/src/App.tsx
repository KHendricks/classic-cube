import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Theme
import { createTheme, ThemeProvider } from "@mui/material/styles";

// UI
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

// Utilities
import { MAX_SUPPLY } from "./util/config";
import {
  connectWallet,
  getCurrentWalletConnected,
  getPausedStatus,
  getTotalSupply,
  connectedContract,
} from "./util/interact";

// Helper Components
import Header from "./components/header";
import Footer from "./components/footer";
import Team from "./components/team";
import Checkout from "./components/checkout";
import MovingBanner from "./components/movingBanner";
import FAQ from "./components/faq";

// Fonts
import "./App.css";

// Images
import bbLogo from "./bbLogo_mixed.png";

// Background created from https://www.transparenttextures.com/
import background from "./notebook-dark.png";

declare let window: any;
const DEV_MODE = process.env.REACT_APP_DEV_MODE;

function App() {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [successState, setSuccessState] = useState(false);
  const [failState, setFailState] = useState(false);
  const [vertical, setVertical] = useState("bottom" as "bottom");
  const [horizontal, setHorizontal] = useState("center" as "center");
  const [remainingTokens, setRemainingTokens] = useState(-1);
  const [isPaused, setIsPaused] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitalLoading, setIsInitialLoading] = useState(true);

  const addWalletListener = useCallback(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          if (walletAddress.length > 0) {
            setSuccessState(true);
          }
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
      window.ethereum.on("chainChanged", (accounts: string[]) => {
        window.location.reload();
      });
    } else {
      setStatus("🦊 Metamask not installed");
      setFailState(true);
    }
  }, [walletAddress, setWallet]);

  const addSmartContractListener = useCallback(() => {
    connectedContract.events.CreateNFT((error: any, data: any) => {
      if (error) {
        setFailState(true);
        setStatus(error.message);
      } else {
        try {
        } catch (error: any) {
          console.log(error);
        }
        setStatus("Transaction pending...");
        setSuccessState(true);
        setIsLoading(false);
      }
    });
  }, [setFailState, setStatus]);

  useEffect(() => {
    document.title = "Bunny Babies";

    async function getWallet() {
      getCurrentWalletConnected()
        .then((data) => {
          setWallet(data.address);
          setStatus(data.status);
          addWalletListener();
          checkNetwork();
          addSmartContractListener();
          refreshContractData();
        })
        .catch((err) => console.log(err));
    }
    getWallet();
  }, [addWalletListener, addSmartContractListener]);

  const connect = async () => {
    const walletResponse = await connectWallet();
    await setStatus(walletResponse.status);
    await setWallet(walletResponse.address);

    if (walletResponse.address.length > 0) {
      setSuccessState(true);
      setStatus(`Connected to ${walletResponse.address}`);
      return true;
    } else {
      setFailState(true);
      return false;
    }
  };

  const checkNetwork = () => {
    if (window.ethereum) {
      if (DEV_MODE === "ENABLED") {
        if (window.ethereum.networkVersion !== "4") {
          setStatus("Currently in dev mode. Please connect to Rinkeby Testnet");
          setFailState(true);
          return;
        }
      } else {
        if (window.ethereum.networkVersion !== "1") {
          setStatus("Please connect to Ethereum Mainnet");
          setFailState(true);
          return;
        }
      }
    }
  };

  const getNetwork = () => {
    if (window.ethereum) {
      switch (window.ethereum.networkVersion) {
        case "1":
          return "Main";
        case "2":
          return "Morden";
        case "3":
          return "Ropsten";
        case "4":
          return "Rinkeby";
        case "42":
          return "Kovan";
        default:
          return "Unknown";
      }
    }
  };

  const handleCloseSnack = async (event: any, reason: any) => {
    setFailState(false);
    setSuccessState(false);
    setIsLoading(false);
  };

  const refreshContractData = async () => {
    getTotalSupply()
      .then((data) => {
        if (data.success) {
          setRemainingTokens(MAX_SUPPLY - data.data);
        }
      })
      .catch((error: any) => console.log(error));

    getPausedStatus()
      .then((data) => {
        if (data.data !== 0) {
          setIsPaused(true);
        } else {
          setIsPaused(false);
        }
      })
      .catch((error: any) => console.log(error));

    setIsInitialLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={failState}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
        message="Note archived"
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {status}
        </Alert>
      </Snackbar>

      <Snackbar
        open={successState}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
        message="Note archived"
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {status}
        </Alert>
      </Snackbar>

      <Grid
        style={styles.gridContainer}
        container
        direction="row"
        spacing={4}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} sm={12} md={12} lg={12} textAlign="center">
          <Header
            connect={connect}
            walletAddress={walletAddress}
            setSuccessState={setSuccessState}
            isInitalLoading={isInitalLoading}
          />
        </Grid>
        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={5}
          lg={5}
          textAlign="center"
        >
          <img style={styles.logoImage} src={bbLogo} alt="logo" />
        </Grid>
        <Grid
          style={styles.gridItem}
          item
          xs={10}
          md={8}
          lg={8}
          textAlign="center"
        >
          <Typography
            variant="body1"
            style={{ fontFamily: "Cabin", color: "#000000" }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            vehicula consequat nisl ut aliquet. Interdum et malesuada fames ac
            ante ipsum primis in faucibus. Maecenas quis tellus rutrum, finibus
            sapien a, tincidunt leo. Duis sed ipsum purus. Sed consequat justo
            ut laoreet consequat. Quisque aliquet elit ligula, quis suscipit mi
            commodo nec. Cras placerat quam blandit leo aliquet, finibus
            facilisis arcu sagittis. Nullam ac dictum eros. Vestibulum gravida
            nulla quis pretium volutpat. Donec urna erat, cursus eu sapien eget,
            mollis finibus dui. Sed sapien massa, tempus id lectus non, luctus
            pulvinar neque. Quisque in eros nisl. Nulla dignissim risus sit amet
            nisi gravida luctus. Sed bibendum purus non urna blandit dapibus.
            Mauris ut dapibus turpis. Sed vitae nisl eu ante interdum lacinia eu
            in velit. Vestibulum nec sem sit amet neque gravida accumsan
            suscipit ut risus. In mollis libero ipsum. Nulla sed convallis nisi,
            sit amet aliquam enim. Maecenas egestas et odio et hendrerit.
            Maecenas ut sapien et massa congue imperdiet. Mauris porttitor eros
            sed porta rutrum. Vestibulum dignissim, risus mattis pretium mollis,
            erat purus tempor tellus, eu malesuada turpis magna vel est. Nunc
            aliquet porta magna, sit amet congue nisi tempus blandit. Ut
            faucibus lacinia imperdiet. Praesent tincidunt libero metus, vitae
            iaculis mauris vestibulum sed. In tortor ipsum, consequat quis
            scelerisque eu, gravida in risus. Sed condimentum massa id nulla
            pellentesque, quis imperdiet odio tempor. Praesent ante enim,
            molestie eget malesuada ut, malesuada eget velit. Sed vehicula,
            felis ut porttitor placerat, nibh nisi pellentesque nisi, at
            pulvinar quam risus non mauris. Sed porta leo quis nunc efficitur,
            eu egestas leo tempus. Curabitur hendrerit neque ut mi ultrices
            auctor. Maecenas lacinia nulla id justo rutrum, eget suscipit purus
            maximus. Aliquam erat volutpat.
          </Typography>
        </Grid>
        <Grid
          item
          xs={11}
          sm={11}
          md={6}
          lg={5}
          textAlign="center"
          marginTop={10}
        >
          {isInitalLoading ? (
            <CircularProgress />
          ) : (
            <Checkout
              setFailState={setFailState}
              setStatus={setStatus}
              walletAddress={walletAddress}
              remainingTokens={remainingTokens}
              setRemainingTokens={setRemainingTokens}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              connect={connect}
              isPaused={isPaused}
              refreshContractData={refreshContractData}
            />
          )}
        </Grid>
        <Grid item xs={12} textAlign="center" marginTop={9}>
          <Typography variant="h2" display="block" style={styles.sectionTitles}>
            COLLECTION
          </Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <MovingBanner />
        </Grid>
        <Grid item xs={12} textAlign="center" marginTop={9}>
          <Typography variant="h2" display="block" style={styles.sectionTitles}>
            FAQ
          </Typography>
        </Grid>
        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={8}
          lg={8}
          textAlign="center"
        >
          <FAQ
            title="How do I purchase a Candy Cube?"
            body="We utilize a smart contract to handle the minting of the tokens. To
            start your purchase you need to connect to your Metamask wallet by
            clicking the button at top of the page and connect the wallet you wish
            to complete the purchase with. Once the sale is open you will be able
            purchase your cubes through the website."
          />
        </Grid>

        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={8}
          lg={8}
          textAlign="center"
        >
          <FAQ
            title="Will the price ever change?"
            body="The price of a Candy Cube token will always be .01 Ethereum during the
            sale of the initial minting of the tokens. Once the tokens are sold out
            the price can fluctuate based on demand and scarcity."
          />
        </Grid>

        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={8}
          lg={8}
          textAlign="center"
        >
          <FAQ
            title="How was the art made?"
            body="Each piece was intricately made by our talented team members. Once all
            the pieces were created a program randomly generated the unique final images."
          />
        </Grid>

        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={8}
          lg={8}
          textAlign="center"
        >
          <FAQ
            title="How many Candy Cubes can I mint?"
            body="You can mint up to 20 Candy Cube tokens per transaction."
          />
        </Grid>
        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={8}
          lg={8}
          textAlign="center"
        >
          <FAQ
            title="How many Candy Cubes exist?"
            body="There will only ever be 777 Candy Cubes ever released so be sure to
            grab them while you can!"
          />
        </Grid>
        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={8}
          lg={8}
          textAlign="center"
        >
          <FAQ
            title="How do I view my Candy Cube?"
            body="After you mint your Candy Cube tokens they will appear in the wallet
            that was used for the purchase. To view what bunny you received you can
            look at your account on a platform like Opensea or Rarible."
          />
        </Grid>
        <Grid
          style={styles.gridItem}
          item
          xs={11}
          sm={11}
          md={8}
          lg={8}
          textAlign="center"
        >
          <FAQ
            title="What Candy Cubes will I receive?"
            body="No one knows! That’s all part of the fun! Since each Candy Cube was
            randomly generated there is no telling which ones you will get when you
            mint your tokens."
          />
        </Grid>

        {/* <Grid item xs={12} textAlign="center" marginTop={9}>
          <Typography variant="h2" display="block" style={styles.sectionTitles}>
            TEAM
          </Typography>
        </Grid>
        <Grid style={styles.gridItem} item xs={12} textAlign="right">
          <Team />
        </Grid> */}

        <Grid
          style={styles.gridItem}
          item
          xs={12}
          textAlign="center"
          marginTop={5}
        >
          <Footer />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

const styles = {
  gridContainer: {
    backgroundImage: `url("https://www.transparenttextures.com/patterns/lined-paper.png")`,
  },
  gridItem: {},
  logoImage: {
    width: "100%",
  },
  sectionTitles: { fontFamily: "Signika", color: "#ff9249" },
};

const theme = createTheme({
  typography: {
    fontFamily: [
      "Nunito",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      "Drift",
    ].join(","),
  },
  palette: {
    primary: {
      main: "#c2f2d0", // Button Color
      contrastText: "#6b3e26", // Button Text
    },
    secondary: {
      main: "#7bab56", // Button Color
      contrastText: "", // Button Text
    },
  },
});

export default App;
