import { grey } from "@material-ui/core/colors";
export default {
  regionInfo: {
    fontSize: 12,
    cursor: "default",
    transition: "opacity 200ms",
    opacity: 0.5,
    "&:hover": {
      opacity: 0.9,
      cursor: "pointer"
    },
    "&.highlighted": {
      opacity: 0.9,
      "&:hover": {
        opacity: 1
      }
    },
    // pointerEvents: "none",
    fontWeight: 600,
    padding: 8,
    "& .name": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& .circle": {
        marginRight: 4,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.4)",
        width: 10,
        height: 10,
        borderRadius: 5
      }
    },
    "& .tags": {
      "& .tag": {
        display: "inline-block",
        margin: 1,
        fontSize: 10,
        textDecoration: "underline"
      }
    }
  }
};