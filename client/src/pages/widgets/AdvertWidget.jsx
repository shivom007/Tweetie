import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "componets/FlexBetween";
import WidgetWrapper from "componets/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      {/* <img
        width="100%"
        height="auto"
        alt="advert"
        src=""
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      /> */}
      <FlexBetween>

      <Box flexBasis="26%">
            
            <Box m="2rem 0" />
             
          </Box>
      </FlexBetween>
      <FlexBetween>
        <Typography color={main}>MikaCosmetics</Typography>
        <Typography color={medium}>mikacosmetics.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Your pathway to stunning and immaculate beauty and made sure your skin
        is exfoliating skin and shining like light.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
