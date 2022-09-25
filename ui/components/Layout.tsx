import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "./Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Navbar />
      {children}
    </Box>
  );
}

export default Layout;
