import React from "react";

// UI
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// Images
import profileA from "../profileA.svg";

const Team = () => {
  return (
    <Grid
      style={styles.gridContainer}
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Grid
        style={styles.gridItem}
        item
        xs={12}
        md={6}
        lg={3}
        textAlign="center"
        marginBottom={3}
      >
        <img style={styles.profileImage} src={profileA} alt="AAAA" />
        <Typography
          textAlign="center"
          style={styles.sectionTitles}
          variant="h4"
        >
          AAA
        </Typography>
        <Typography
          style={styles.teamSubTitle}
          textAlign="center"
          variant="subtitle2"
        >
          Creative Lead
        </Typography>
      </Grid>

      <Grid
        style={styles.gridItem}
        item
        xs={12}
        md={6}
        lg={3}
        textAlign="center"
        marginBottom={3}
      >
        <img style={styles.profileImage} src={profileA} alt="BBBB" />
        <Typography
          textAlign="center"
          style={styles.sectionTitles}
          variant="h4"
        >
          BBBB
        </Typography>
        <Typography
          style={styles.teamSubTitle}
          textAlign="center"
          variant="subtitle2"
        >
          Graphic Designer
        </Typography>
      </Grid>

      <Grid
        style={styles.gridItem}
        item
        xs={12}
        md={6}
        lg={3}
        textAlign="center"
        marginBottom={3}
      >
        <img style={styles.profileImage} src={profileA} alt="CCCC" />
        <Typography
          textAlign="center"
          style={styles.sectionTitles}
          variant="h4"
        >
          CCCC
        </Typography>
        <Typography
          style={styles.teamSubTitle}
          textAlign="center"
          variant="subtitle2"
        >
          Technical Lead
        </Typography>
      </Grid>
    </Grid>
  );
};

const styles = {
  gridContainer: {},
  gridItem: {},
  smartContractButton: {
    color: "#000",
  },
  iconStyle: {
    height: "3vh",
    width: "4vw",
    color: "black",
  },
  sectionTitles: { fontFamily: "Signika", color: "#ff9249" },
  profileImage: {
    height: "200px",
    width: "200px",
  },
  teamSubTitle: {
    color: "#7bab56",
    fontFamily: "Cabin",
  },
};

export default Team;
