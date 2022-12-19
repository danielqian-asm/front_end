// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { exec }  from 'child_process'
import path from 'path'
// { exec, execSync } 

type Data = {
  id: string
}

const pythonScript = `/home/ubuntu/style_filter/generate_arts.py`

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { width, height, step, prompt, imagesId, imageNumber, weights, promptWeights } = req.body
  let totalWeight = promptWeights
  let leftWeight = 0
  weights.forEach((i: any) => totalWeight += i.value)
  const weightsList = weights.map((i: any, index: number) => {
    const w = Math.round(i.value / totalWeight * 100)
    leftWeight += w
    return `--c${index}_id "${i.id}" --c${index}_weights ${w}`
  })
  try {
    exec(`python ${pythonScript} --prompt "${prompt}" --prompt_weights ${100 - leftWeight} ${weightsList.join(' ')} --image_num ${imageNumber} --images_id "${imagesId}" --ddim_steps ${step} --H ${height} --W ${width}`)
    return res.status(200).json({ id: imagesId })
  } catch (err) {
    console.log(err)
  }
}
