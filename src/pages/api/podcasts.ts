import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/auth";
import z from "zod";
import { prisma } from "@/server/db";

const Podcasts = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerAuthSession({ req, res });

  if (!session || session?.user?.role !== "ADMIN") {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    await prisma.$connect();

    const podcasts = await prisma.podcast.findMany();

    res.status(200).json({ podcasts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  } finally {
    await prisma.$disconnect();
  }
};

export default Podcasts;
