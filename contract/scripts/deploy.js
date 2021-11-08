async function main() {
  const CandyCubes = await ethers.getContractFactory("CandyCubes");

  const candyCubes = await CandyCubes.deploy(
    "CandyCubes",
    "BUN",
    "Qmcbaw1ijr6hyhsd3XQvJJH7ecSC6jQCn7ezoWNJsCmGXg"
  );
  console.log("Contract was deployed to: ", candyCubes.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
