import { useForm, isNotEmpty } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Box,
  Radio,
  FileInput,
  Loader,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { useS3Upload } from "next-s3-upload";

const notifyError = () =>
  toast.error("Something went wrong, Please try again.", {
    position: "bottom-right",
  });

const notifySuccess = () =>
  toast.success("Podcast added successfully.", {
    position: "bottom-right",
  });

const MIME_AUDIO = ["audio/mpeg", "audio/mp3"];

const MIME_VIDEO = ["video/mp4", "video/mpeg"];

const MIME_IMG = ["image/png", "image/jpeg", "image/gif"];

interface FormValues {
  title: string;
  description: string;
  category: string;
  type: "audio" | "video";
  speaker: string;
  thumbnail: File | null;
  podcast: File | null;
}

const Admin = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  let { uploadToS3 } = useS3Upload();

  let handleUpload = async (file: File) => {
    let uploadResults = await uploadToS3(file);
    return uploadResults.url;
  };

  useEffect(() => {
    if (
      status !== "loading" &&
      (status === "unauthenticated" || session?.user?.role !== "ADMIN")
    ) {
      router.push("/");
    }
  }, [status, router, session]);

  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      description: "",
      category: "",
      type: "audio",
      speaker: "",
      thumbnail: null,
      podcast: null,
    },

    validate: {
      title: isNotEmpty("Enter podcast title"),
      description: isNotEmpty("Enter podcast description"),
      category: isNotEmpty("Enter podcast category"),
      type: isNotEmpty("Enter podcast type"),
      speaker: isNotEmpty("Enter podcast speaker"),
      thumbnail: isNotEmpty("Enter podcast thumbnail"),
      podcast: isNotEmpty("Enter podcast file"),
    },
  });

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="w-screen flex flex-col items-center">
      <Toaster />
      <div className="w-96 mb-14">
        <h3 className="text-gray-200 my-12 text-center">Add New Podcast</h3>
        <Box
          component="form"
          maw={400}
          onSubmit={form.onSubmit(async (val) => {
            try {
              setIsSubmitting(true);
              const newThumbnailURL = await handleUpload(val.thumbnail as File);
              const newPodcastURL = await handleUpload(val.podcast as File);

              const res = await fetch("/api/add-podcast", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: val.title,
                  description: val.description,
                  category: val.category,
                  type: val.type,
                  speaker: val.speaker,
                  thumbnail: newThumbnailURL,
                  url: newPodcastURL,
                }),
              });

              if (res.ok) {
                notifySuccess();
                form.reset();
                console.log("Podcast added successfully");
              }
            } catch (error) {
              notifyError;
              console.log(error);
            } finally {
              setIsSubmitting(false);
            }
          })}
        >
          <TextInput
            label="Title"
            placeholder="Title"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <TextInput
            label="Description"
            placeholder="Description"
            withAsterisk
            mt="md"
            {...form.getInputProps("description")}
          />
          <TextInput
            label="Category"
            placeholder="Category"
            withAsterisk
            mt="md"
            {...form.getInputProps("category")}
          />
          <TextInput
            label="Speaker"
            placeholder="Speaker"
            withAsterisk
            mt="md"
            {...form.getInputProps("speaker")}
          />
          <Radio.Group
            name="type"
            label="Select your podcast format."
            withAsterisk
            mt="md"
            {...form.getInputProps("type")}
          >
            <Group mt="xs">
              <Radio value="audio" label="Audio" />
              <Radio value="video" label="Video" />
            </Group>
          </Radio.Group>
          <FileInput
            label="Thumbnail"
            placeholder="Select thumbnail Picture"
            accept={MIME_IMG.join(",")}
            withAsterisk
            mt="md"
            {...form.getInputProps("thumbnail")}
          />
          <FileInput
            label="Podcast"
            placeholder="Select podcast file"
            accept={
              form.values.type === "audio"
                ? MIME_AUDIO.join(",")
                : MIME_VIDEO.join(",")
            }
            withAsterisk
            mt="md"
            {...form.getInputProps("podcast")}
          />

          <Group position="center" mt="md">
            {isSubmitting ? (
              <Loader color="violet" size="md" mt="md" />
            ) : (
              <Button color="violet" size="md" mt="md" type="submit">
                Submit
              </Button>
            )}
          </Group>
        </Box>
      </div>
    </div>
  );
};

export default Admin;
