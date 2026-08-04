import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/toast";
import authServices from "@/api/auth/auth";
import { VENDOR_CONSTANT } from "./constant";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function RegistrationSuccessDialog({
  open,
  setOpen,
  onVerifyClick,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onVerifyClick: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          sm:max-w-md
          rounded-sm
          border-primary/20
          bg-amber-50
          [&_[data-slot='dialog-close']]:transition-colors
          [&_[data-slot='dialog-close']]:rounded-sm
          [&_[data-slot='dialog-close']:hover]:bg-rose-50
          [&_[data-slot='dialog-close']:hover]:text-rose-500
          border-none
          shadow-lg
          transition-shadow duration-200
          hover:shadow-xl
        "
      >
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>

          <DialogDescription className="mt-1 mb-3 text-center text-gray-500 leading-1 tracking-wider text-[13px]">
            Your vendor application has been successfully registered.
            <br />
            An OTP has been sent to your email for verification.
          </DialogDescription>
        </DialogHeader>

        <Button
          className="w-full rounded-sm bg-green-600 transition-all duration-200 hover:bg-green-400  hover:shadow-md py-6 text-white tracking-wider"
          onClick={onVerifyClick}
        >
          Verify Email
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function VerifyEmailDialog({
  verifyEmail,
  setVerifyEmail,
  submitted,
}: {
  verifyEmail: boolean;
  setVerifyEmail: (v: boolean) => void;
  submitted: { email: string } | null;
}) {
  const [otp, setOtp] = useState("");
  const [rateLimit, setRateLimit] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    VENDOR_CONSTANT.OTP_LIFETIME_SECONDS,
  );
  const [resendCooldown, setResendCooldown] = useState(
    VENDOR_CONSTANT.RESEND_COOLDOWN_SECONDS,
  );

  const isExpired = secondsLeft <= 0;
  const canResend = resendCooldown <= 0;

  useEffect(() => {
    if (verifyEmail) {
      setSecondsLeft(VENDOR_CONSTANT.OTP_LIFETIME_SECONDS);
      setResendCooldown(VENDOR_CONSTANT.RESEND_COOLDOWN_SECONDS);
      setOtp("");
    }
  }, [verifyEmail]);

  useEffect(() => {
    if (!verifyEmail || isExpired) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [verifyEmail, isExpired]);

  useEffect(() => {
    if (!verifyEmail || canResend) return;
    const interval = setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [verifyEmail, canResend]);

  async function handleVerify() {
    if (!otp || !submitted?.email) return;

    try {
      await authServices.verifyOtp({ email: submitted.email, otp });

      setVerifyEmail(false);

      toast.add({
        type: "success",
        title: "Email Verify",
        description: "Your email is verified successfully",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          setOtp("");
          toast.add({ type: "error", title: "OTP not matched" });
        }

        if (status === 429) {
          setRateLimit(true);
          toast.add({
            type: "error",
            title: "Rate limit hit",
            description: "You have to wait a few minutes before trying again!",
          });
        }
      }
    }
  }

  async function handleResend() {
    if (!submitted?.email) return;

    try {
      await authServices.resendOtp({ email: submitted.email });
      setSecondsLeft(VENDOR_CONSTANT.OTP_LIFETIME_SECONDS);
      setResendCooldown(VENDOR_CONSTANT.RESEND_COOLDOWN_SECONDS);
      setOtp("");
      setVerifyEmail(false);
      toast.add({ type: "success", title: "A new code has been sent" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setRateLimit(true);
          toast.add({
            type: "error",
            title: "Rate limit hit",
            description: "You have to wait a few minutes before trying again!",
          });
        }
        return;
      }

      toast.add({ type: "error", description: "Failed to generate OTP" });
    }
  }

  return (
    <Dialog open={verifyEmail} onOpenChange={setVerifyEmail}>
      <DialogContent
        className="
          sm:max-w-md
          rounded-lg
          border-none
          shadow-lg
          transition-shadow
          duration-200
          hover:shadow-xl
          p-8
          bg-amber-50
          [&_[data-slot='dialog-close']]:rounded-sm
          [&_[data-slot='dialog-close']]:transition-colors
          [&_[data-slot='dialog-close']:hover]:bg-rose-50
          [&_[data-slot='dialog-close']:hover]:text-rose-500
        "
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-2xl font-semibold tracking-wider text-gray-900">
            Verify your email
          </DialogTitle>

          <DialogDescription className="text-center text-[12px] leading-6 tracking-wider text-muted-foreground">
            Enter the 6-digit verification code sent to your email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isExpired}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="
    h-12
    w-12
    border
    rounded-sm
    bg-primary/5
    text-lg
    text-primary
    transition-all
    duration-200
    outline-none
    ring-0
    focus:ring-0
    focus-visible:ring-0
    focus:outline-none
    focus-visible:outline-none
    data-[active=true]:border-green-400
  "
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p
          className={`text-center text-xs mb-2 tracking-wide ${
            isExpired ? "text-rose-500" : "text-gray-500"
          }`}
        >
          {isExpired
            ? "Code expired — request a new one"
            : `Expires in ${formatTime(secondsLeft)}`}
        </p>

        <Button
          className="
            h-12
            w-full
            rounded-sm
            bg-green-600
            text-base
            font-medium
            tracking-wide
            text-white
            transition-all
            duration-200
            hover:bg-green-400
            hover:shadow-md
            disabled:opacity-60
          "
          disabled={rateLimit || isExpired || otp.length < 6}
          onClick={handleVerify}
        >
          Verify OTP
        </Button>

        {canResend ? (
          <Button
            className="
              mt-2
              h-12
              w-full
              
              rounded-sm
              bg-cta
              text-base
              font-medium
              tracking-wide
              bg-blue-600
              text-white
              transition-all
              duration-200
              hover:bg-blue-400
              hover:shadow-md
              disabled:opacity-60
            "
            disabled={rateLimit}
            onClick={handleResend}
          >
            Resend OTP
          </Button>
        ) : (
          <p className="mt-2 text-center text-xs text-gray-400">
            You can resend in {formatTime(resendCooldown)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { RegistrationSuccessDialog, VerifyEmailDialog };
