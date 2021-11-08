async function main() {
  const EtherCubes = await ethers.getContractFactory("EtherCubes");

  const etherCubes = await EtherCubes.deploy(
    "EtherCubes",
    "ECUBE",
    "Qmcbaw1ijr6hyhsd3XQvJJH7ecSC6jQCn7ezoWNJsCmGXg"
  );
  console.log("Contract was deployed to: ", etherCubes.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
