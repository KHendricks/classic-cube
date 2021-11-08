import React from "react";
import Typography from "@mui/material/Typography";

// Icons
import { RiTwitterLine, RiDiscordLine } from "react-icons/ri";
import OpenseaLogo from "../opensea_logo.svg";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import "../App.css";

const Footer = () => {
  const goToTwitter = () => {
    window.open("https://twitter.com/Bunny_Babies");
  };
  const goToDiscord = () => {
    window.open("https://discord.gg/vyvyD6bhnf");
  };
  const goToOpensea = () => {
    window.open("https://opensea.io/");
  };

  return (
    <Grid
      style={styles.gridContainer}
      container
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
    >
      <Grid style={styles.gridItem} item xs={12} textAlign="center">
        <Typography variant="h4" display="block" style={styles.sectionTitles}>
          Candy Cubes
        </Typography>
      </Grid>

      <Grid item xs={4} textAlign="center">
        <IconButton onClick={goToTwitter}>
          <RiTwitterLine style={styles.iconStyle} />
        </IconButton>
        <IconButton onClick={goToDiscord}>
          <RiDiscordLine style={styles.iconStyle} />
        </IconButton>
      </Grid>

      <Grid item xs={12} textAlign="center">
        <Button style={styles.smartContractButton} variant="text">
          Smart Contract
        </Button>
      </Grid>
    </Grid>
  );
};

const styles = {
  gridContainer: { borderTop: "3px solid rgba(0, 0, 0, 1)" },
  gridItem: { marginRight: 20, marginLeft: 20, marginTop: 20 },
  smartContractButton: {
    color: "#7bab56",
  },
  iconStyle: {
    height: "3vh",
    width: "4vw",
    color: "#7bab56",
  },
  sectionTitles: { fontFamily: "Signika", color: "#ff9249" },
};

export default Footer;
