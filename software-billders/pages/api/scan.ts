// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fetch("https://api.legiscan.com/?key=53acbad59cb0b801e3e3f4c1d3af58d3&&op=getSearch").then(r => r.json()).then(data => res.json(data));
  //res.status(200).json({ name: 'John Doe' })
}
