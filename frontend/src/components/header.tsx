import React from "react";

// UI
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

// Icons
import CircleIcon from "@mui/icons-material/Circle";

interface HeaderProps {
  connect: any;
  walletAddress: string;
  setSuccessState: any;
  isInitalLoading: boolean;
}

const Header = ({
  connect,
  walletAddress,
  setSuccessState,
  isInitalLoading,
}: HeaderProps) => {
  return (
    <Grid container direction="row">
      <Grid p={3} item xs={12} textAlign="right">
        {isInitalLoading ? (
          <CircularProgress />
        ) : walletAddress.length > 0 ? (
          <Button
            style={{ justifyContent: "center", alignItems: "center" }}
            variant="contained"
            color="primary"
          >
            <CircleIcon sx={styles.connectedIcon} />
            <Typography m={1} variant="button" display="block" gutterBottom>
              {String(walletAddress).substring(0, 6) +
                "..." +
                String(walletAddress).substring(38)}
            </Typography>
          </Button>
        ) : (
          <Button
            style={{ justifyContent: "center", alignItems: "center" }}
            variant="contained"
            color="primary"
            onClick={connect}
          >
            <CircleIcon sx={styles.disconnectedIcon} />
            <Typography m={1} variant="button" display="block" gutterBottom>
              DISCONNECTED
            </Typography>
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

const styles = {
  headerBox: {
    background: "red",
    justifyContent: "flex-end",
    display: "flex",
    flex: 1,
  },
  disconnectedIcon: {
    fontSize: 14,
    color: "#e84c45",
  },
  connectedIcon: {
    fontSize: 14,
    color: "#49b675",
  },
};

export default Header;
