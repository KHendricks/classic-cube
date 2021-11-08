import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

// Minting
import { MAX_MINT_AMOUNT, MAX_SUPPLY, PRICE } from "../util/config";
import { mint, getTotalSupply } from "../util/interact";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface CheckoutProps {
  setFailState: any;
  setStatus: any;
  walletAddress: string;
  setRemainingTokens: any;
  remainingTokens: number;
  isLoading: boolean;
  setIsLoading: any;
  connect: any;
  isPaused: boolean;
  refreshContractData: any;
}

const Checkout = ({
  setFailState,
  setStatus,
  walletAddress,
  remainingTokens,
  setRemainingTokens,
  setIsLoading,
  isLoading,
  connect,
  isPaused,
  refreshContractData,
}: CheckoutProps) => {
  const [purchaseCount, setPurchaseCount] = useState(1);

  useEffect(() => {
    async function getRemainingTokens() {
      getTotalSupply()
        .then((data) => {
          if (data.success) {
            setRemainingTokens(MAX_SUPPLY - data.data);
          }
        })
        .catch((error: any) => console.log(error));
    }
    getRemainingTokens();
  }, [setRemainingTokens]);

  const incrementPurchaseCount = async () => {
    if (purchaseCount < MAX_MINT_AMOUNT) {
      setPurchaseCount(purchaseCount + 1);
    }
  };

  const decrementPurchaseCount = async () => {
    if (purchaseCount > 1) {
      setPurchaseCount(purchaseCount - 1);
    }
  };

  const maxPurchaseCount = async () => {
    setPurchaseCount(MAX_MINT_AMOUNT);
  };

  const minPurchaseCount = async () => {
    setPurchaseCount(1);
  };

  const purchaseTokens = async () => {
    if (walletAddress.length === 0) {
      await connect();
    }

    await refreshContractData();

    setIsLoading(true);

    if (purchaseCount > MAX_MINT_AMOUNT) {
      setFailState(true);
      setStatus(
        `Can not purchase more than ${MAX_MINT_AMOUNT} in on transaction.`
      );
      return;
    } else if (purchaseCount > remainingTokens) {
      setFailState(true);
      setStatus(`Not enough cubes remaining!`);
      return;
    }

    mint(walletAddress, purchaseCount).then((data) => {
      if (!data.success) {
        setStatus(data.status);
        setFailState(true);
      }
    });
  };

  return (
    <Grid
      style={{ background: "#372772DA", borderRadius: 20 }}
      container
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Grid p={3} item xs={12} textAlign="center">
        <Typography variant="h4" display="block" style={styles.sectionTitles}>
          Mint your Candy Cube
        </Typography>
      </Grid>

      {walletAddress.length > 0 ? (
        <Grid p={3} item xs={12} textAlign="center">
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={100 - (remainingTokens / MAX_SUPPLY) * 100}
          />

          <Typography
            variant="subtitle2"
            display="block"
            style={styles.sectionTitles}
          >
            {(100 - (remainingTokens / MAX_SUPPLY) * 100).toFixed(2)}% (
            {remainingTokens + " "}
            Cubes Left)
          </Typography>
        </Grid>
      ) : (
        <Grid p={3} item xs={12} textAlign="center">
          <LinearProgress variant="determinate" color="secondary" value={0} />
          <Typography
            variant="subtitle2"
            display="block"
            style={styles.sectionTitles}
          >
            Please connect to your wallet
          </Typography>
        </Grid>
      )}

      <Grid
        m={1}
        item
        xs={12}
        textAlign="center"
        style={{ borderTop: "1px solid rgba(0, 0, 0, 1)" }}
      />

      <Grid p={2} item xs={12} textAlign="center">
        <Typography variant="h5" display="block" style={styles.sectionTitles}>
          Quantity
        </Typography>
      </Grid>

      <Grid item xs={4} textAlign="right">
        <IconButton
          style={styles.purchaseStyleButtons}
          onClick={decrementPurchaseCount}
        >
          <RemoveIcon />
        </IconButton>
      </Grid>

      <Grid item xs={4} textAlign="center">
        <Typography variant="h6" display="block" style={styles.subSection}>
          {purchaseCount}
        </Typography>
      </Grid>

      <Grid item xs={4} textAlign="left">
        <IconButton
          style={styles.purchaseStyleButtons}
          onClick={incrementPurchaseCount}
        >
          <AddIcon />
        </IconButton>
      </Grid>

      <Grid p={1} item xs={6} textAlign="right">
        <Button
          onClick={minPurchaseCount}
          style={styles.maxPurchaseStyleButtons}
        >
          MIN
        </Button>
      </Grid>

      <Grid p={1} item xs={6} textAlign="left">
        <Button
          onClick={maxPurchaseCount}
          style={styles.maxPurchaseStyleButtons}
        >
          MAX
        </Button>
      </Grid>

      <Grid
        m={1}
        item
        xs={12}
        textAlign="center"
        style={{ borderTop: "1px solid rgba(0, 0, 0, 1)" }}
      />

      <Grid p={2} item xs={12} textAlign="center">
        <Typography variant="h5" display="block" style={styles.sectionTitles}>
          Price
        </Typography>
      </Grid>

      <Grid p={1} item xs={12} textAlign="center">
        <Typography variant="h6" display="block" style={styles.subSection}>
          {(purchaseCount * PRICE).toFixed(2)} Ethereum
        </Typography>
      </Grid>

      <Grid m={3} item xs={12} textAlign="center">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <CircularProgress style={{ opacity: 0 }} />
        )}
      </Grid>

      {walletAddress.length > 0 && (
        <Grid m={3} item xs={12} textAlign="center">
          {isLoading || remainingTokens === 0 ? (
            <Button variant="contained" color="primary" disabled>
              <Typography m={1}>Purchase Cube</Typography>
            </Button>
          ) : isPaused ? (
            <Button disabled variant="contained" color="primary">
              <Typography m={1}>Sale Opens Soon</Typography>
            </Button>
          ) : (
            <Button
              onClick={purchaseTokens}
              variant="contained"
              color="primary"
            >
              <Typography m={1}>Purchase Cube</Typography>
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

const styles = {
  gridContainer: {},
  sectionTitles: { fontFamily: "Signika", color: "#ff9249" },
  subSection: { color: "#7bab56", fontFamily: "Cabin" },
  purchaseStyleButtons: {
    color: "#7bab56",
  },
  maxPurchaseStyleButtons: {
    color: "#7bab56",
    fontFamily: "Cabin",
  },
};

export default Checkout;
