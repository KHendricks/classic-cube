import React from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Grid from "@mui/material/Grid";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

let theme = createTheme();
theme = responsiveFontSizes(theme);
interface FaqProps {
  title: String;
  body: String;
}

const FAQ = ({ title, body }: FaqProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row">
        <Grid p={3} textAlign="left" style={styles.gridItem} item xs={10}>
          <Typography variant="h4" display="block" style={styles.sectionTitles}>
            {title}
          </Typography>
        </Grid>
        <Grid p={3} textAlign="right" style={styles.gridItem} item xs={2}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ color: "#7bab56" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Grid>

        <Grid textAlign="left" style={styles.gridItem} item xs={12}>
          <Collapse
            style={styles.collapseItem}
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Typography
              textAlign="left"
              variant="body1"
              style={{ fontFamily: "Cabin", color: "#f2f0e6" }}
              p={3}
            >
              {body}
            </Typography>
          </Collapse>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

const styles = {
  gridContainer: {},
  gridItem: { background: "#372772" },
  sectionTitles: { fontFamily: "Signika", color: "#f2f0e6" },
  collapseItem: { borderTop: "1px solid rgba(0, 0, 0, 1)" },
};

export default FAQ;
