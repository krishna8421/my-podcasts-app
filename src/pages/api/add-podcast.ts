import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/auth";
import z from "zod";
import { prisma } from "@/server/db";

const podcastSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  type: z.string(),
  speaker: z.string(),
  url: z.string(),
  thumbnail: z.string(),
});

const AddPodcast = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerAuthSession({ req, res });

  if (!session || session?.user?.role !== "ADMIN") {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    await prisma.$connect();
    const { title, description, category, type, speaker, url, thumbnail } =
      podcastSchema.parse(req.body);

    const podcast = {
      title,
      description,
      category,
      type,
      speaker,
      url,
      thumbnail,
    };
    console.log(podcast);

    await prisma.podcast.create({
      data: podcast,
    });

    res.status(200).json({ message: "Podcast added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  } finally {
    await prisma.$disconnect();
  }
};

export default AddPodcast;
