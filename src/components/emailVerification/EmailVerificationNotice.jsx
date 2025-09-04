'use client';

import { useJumboAuth } from "@/app/providers/JumboAuthProvider";
import axios from "@/lib/services/config";
import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { Div } from "@jumbo/shared";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EmailVerificationNotice = () => {
  const { authUser } = useJumboAuth();
  const [isSending, setIsSending] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    if (authUser?.user?.email_verified_at) {
      router.push("/"); // already verified → go home
    }
  }, [authUser, router]);

  const resendVerificationLink = async () => {
    if (!authUser?.user?.email) return;

    setIsSending(true);

    try {
      const response = await axios.post(`/api/auth/verification-notification`, {
        email: authUser.user.email,
      });

      if (response.status === 200) {
        enqueueSnackbar(response.data.message, { variant: "success" });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        enqueueSnackbar(err?.response?.data?.message || "Something went wrong", {
          variant: "error",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: "wrap",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: (theme) => theme.spacing(4),
      }}
    >
      <Div sx={{ mb: 3, display: "inline-flex" }}>
        <Link href="/" style={{ display: "inline-flex" }}>
          <img
            width={200}
            src={`${ASSET_IMAGES}/logos/proserp-logo.jpeg`}
            alt="ProsERP"
          />
        </Link>
      </Div>

      <Card sx={{ maxWidth: "100%", width: 360, mb: 4 }}>
        <CardContent>
          <Typography textAlign="center" sx={{ mb: 2 }} variant="body1">
            Please verify your email through the link sent to the email address
            below. If the link has expired or you misplaced it, click the Resend
            verification link button to get a new one.
          </Typography>

          <Div sx={{ mb: 3, mt: 1 }}>
            <TextField
              fullWidth
              id="email"
              label="Email"
              defaultValue={authUser?.user?.email}
              disabled
            />
          </Div>

          <LoadingButton
            onClick={resendVerificationLink}
            loading={isSending}
            fullWidth
            variant="contained"
            size="large"
            sx={{ mb: 3, mt: 2 }}
          >
            Resend verification link
          </LoadingButton>

          <Typography textAlign="center" variant="body1" mb={1}>
            Already Verified?{" "}
            <Link href="/" style={{ textDecoration: "none" }}>
              Proceed to Homepage
            </Link>
          </Typography>

          <Typography textAlign="center" variant="body1" mb={1}>
            Don't remember your email?{" "}
            <Link href="/support" style={{ textDecoration: "none" }}>
              Contact Support
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Div>
  );
};

export default EmailVerificationNotice;
