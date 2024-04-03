import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        my: 4,
        borderColor: 'grey.200', 
        backgroundColor: 'none !important', 
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: 3,
            marginBottom: 3,
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            aria-current="page"
            sx={{ px: 2, color: 'text.secondary', textDecoration: 'none' }}
          >
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/events"
            sx={{ px: 2, color: 'text.secondary', textDecoration: 'none' }}
          >
            Events
          </Link>
          <Link
            component={RouterLink}
            to="/contact"
            sx={{ px: 2, color: 'text.secondary', textDecoration: 'none' }}
          >
            Contact Us
          </Link>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
        >
          © 2024 EventXo
        </Typography>
      </Container>
    </Box>
  );
}
