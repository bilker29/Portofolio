import React, { useState } from "react";
import {
  Modal,
  IconButton,
  Box,
  Backdrop,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const Certificate = ({ ImgSertif, Title }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box component="div" sx={{ width: "100%" }}>
      {/* Thumbnail Container */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          backgroundColor: "#fff",
          border: "1px solid rgba(186, 230, 253, 0.85)",
          boxShadow: "0 8px 20px rgba(2, 132, 199, 0.08)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 16px 32px rgba(2, 132, 199, 0.18)",
            "& .overlay": {
              opacity: 1,
            },
            "& .hover-content": {
              transform: "translate(-50%, -50%)",
              opacity: 1,
            },
            "& .certificate-image": {
              transform: "scale(1.04)",
              filter: "contrast(1.05) brightness(0.95) saturate(1.1)",
            },
          },
        }}
      >
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <img
            className="certificate-image"
            src={ImgSertif}
            alt={Title || "Certificate"}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              filter: "contrast(1.06) brightness(0.95) saturate(1.08)",
              transition: "all 0.4s ease",
              aspectRatio: "16/10.5",
            }}
            onClick={handleOpen}
          />

          {/* Hover Overlay */}
          <Box
            className="overlay"
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.45)",
              opacity: 0,
              transition: "all 0.3s ease",
              cursor: "pointer",
              zIndex: 2,
            }}
            onClick={handleOpen}
          >
            <Box
              className="hover-content"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -60%)",
                opacity: 0,
                transition: "all 0.35s ease",
                textAlign: "center",
                width: "100%",
                color: "white",
              }}
            >
              <FullscreenIcon
                sx={{
                  fontSize: 36,
                  mb: 0.5,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                }}
              >
                View Certificate
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Clean Title Caption */}
        {Title && (
          <div
            onClick={handleOpen}
            className="px-4 py-3 bg-white/95 border-t border-slate-100 cursor-pointer"
          >
            <p className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
              {Title}
            </p>
          </div>
        )}
      </Box>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-certificate-title"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(6px)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "auto",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#0f172a",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "white",
              bgcolor: "rgba(15, 23, 42, 0.75)",
              zIndex: 2,
              "&:hover": {
                bgcolor: "rgba(15, 23, 42, 0.95)",
                transform: "scale(1.08)",
              },
            }}
            size="large"
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>

          <img
            src={ImgSertif}
            alt={Title || "Certificate Full View"}
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "82vh",
              margin: "0 auto",
              objectFit: "contain",
            }}
          />
          {Title && (
            <div className="px-5 py-3 bg-slate-900/95 text-center border-t border-slate-800">
              <p className="text-sm font-bold text-white">{Title}</p>
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Certificate;
