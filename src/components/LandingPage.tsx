import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@mantine/core";
import { Montserrat } from "next/font/google";
import { BiRightArrowAlt } from "react-icons/bi";

const montserrat = Montserrat({
  subsets: ["latin"],
});

const LandingPage = () => {
  return (
    <div
      className={`flex justify-center items-center flex-col mt-28 ${montserrat.className}`}
    >
      <h1 className="font-extrabold text-transparent text-center text-5xl sm:text-6xl md:text-8xl bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 my-12">
        MY PODCASTS
      </h1>
      <div className="text-gray-400 text-md md:text-xl text-center mb-16 px-4 max-w-md">
        Find your favorite audio and video podcasts and listen to them on the
        go.
      </div>
      <Button
        color="violet"
        size="md"
        onClick={() => signIn("google")}
        rightIcon={<BiRightArrowAlt size={22} />}
      >
        Get Started
      </Button>
    </div>
  );
};

export default LandingPage;
