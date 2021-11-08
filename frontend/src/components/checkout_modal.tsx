import React, { useState, useEffect } from "react";

import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled, Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";

// Minting
import { MAX_MINT_AMOUNT, MAX_SUPPLY } from "../util/config";
import { mint, getTotalSupply } from "../util/interact";

import CloseIcon from "@mui/icons-material/Close";

interface CheckoutProps {
  closePurchaseWindow: any;
  setFailState: any;
  isCheckoutOpen: boolean;
  setStatus: any;
  walletAddress: string;
  setRemainingTokens: any;
  remainingTokens: number;
  refreshTokenSupplyCount: any;
  isLoading: boolean;
  setIsLoading: any;
}

const Checkout = ({
  isCheckoutOpen,
  closePurchaseWindow,
  setFailState,
  setStatus,
  walletAddress,
  remainingTokens,
  setRemainingTokens,
  refreshTokenSupplyCount,
  setIsLoading,
  isLoading,
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
  }, []);

  const updatePurchaseCount = async (event: any) => {
    var input: number = event.target.value;

    if (input > -1 && input <= MAX_MINT_AMOUNT) {
      setPurchaseCount(event.target.value);
    } else if (purchaseCount > MAX_MINT_AMOUNT) {
      setPurchaseCount(MAX_MINT_AMOUNT);
    }
  };

  const purchaseTokens = async () => {
    await refreshTokenSupplyCount();
    setIsLoading(true);

    if (purchaseCount > MAX_MINT_AMOUNT) {
      setFailState(true);
      setStatus(
        `Can not purchase more than ${MAX_MINT_AMOUNT} in on transaction.`
      );
      return;
    } else if (purchaseCount > remainingTokens) {
      setFailState(true);
      setStatus(`Not enough bunnies remaining!`);
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
      style={{ background: "#ffffff" }}
      container
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Grid item xs={11} textAlign="right">
        <IconButton onClick={closePurchaseWindow}>
          <CloseIcon />
        </IconButton>
      </Grid>

      <Grid item xs={12} textAlign="center">
        <Typography variant="h4" display="block" style={styles.sectionTitles}>
          {remainingTokens} Bunny Babies Left
        </Typography>
      </Grid>

      <Grid item xs={12} textAlign="center">
        <TextField
          id="outlined-number"
          label="How many bunnies?"
          type="number"
          inputProps={{ min: 1, max: MAX_MINT_AMOUNT }}
          value={purchaseCount}
          onChange={updatePurchaseCount}
          helperText={`Mint up to ${MAX_MINT_AMOUNT} bunnies at one time!`}
        />
      </Grid>

      <Grid item xs={12} textAlign="center">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <CircularProgress style={{ opacity: 0 }} />
        )}
      </Grid>

      <Grid item xs={12} textAlign="center">
        {isLoading || remainingTokens == 0 ? (
          <Button variant="contained" color="primary" disabled>
            <Typography m={1}>Purchase Bunny</Typography>
          </Button>
        ) : (
          <Button onClick={purchaseTokens} variant="contained" color="primary">
            <Typography m={1}>Purchase Bunny</Typography>
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const styles = {
  modalStyle: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "250",
    height: "200",
    border: "2px solid #000",
    display: "flex",
  },
  gridContainer: {},
  sectionTitles: { fontFamily: "Signika", color: "#8e6a55" },
};

export default Checkout;
