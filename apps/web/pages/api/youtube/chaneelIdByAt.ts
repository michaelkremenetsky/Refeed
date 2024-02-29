import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const youtube_handle = req.query.handle;
  if (!youtube_handle) {
    return res.status(400).json({
      error: 'Please provide a YouTube handle in the query parameter "handle"',
    });
  }

  const api_key = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${youtube_handle}&key=${api_key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const data = await response.json();
    const channel_id = data.items[0].snippet.channelId;

    res.status(200).json({ channelId: channel_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get channel ID" });
  }
}
