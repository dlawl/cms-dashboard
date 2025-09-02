// (이 파일은 Express 백엔드 전환으로 src/pages/api-legacy/로 이동됨)
type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send('OK');
}
