import type { NextApiRequest, NextApiResponse } from "next";

interface Data {
  channelId?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { username } = req.query;

  if (typeof username !== "string") {
    res.status(400).json({ error: "Username must be provided as a string." });
    return;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const endpoint = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(username)}&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      res.status(200).json({ channelId: data.items[0].id });
    } else {
      res
        .status(404)
        .json({ error: "No channel found for the given username." });
    }
  } catch (error) {
    console.error("Fail to fetch channelId");
    res.status(500).json({ error: "Failed to fetch channel details" });
  }
}
