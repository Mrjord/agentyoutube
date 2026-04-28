import { getUserScripts, getScriptById } from '@/lib/db/queries';
import { V1_USER_ID } from '@/lib/constants';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const script = await getScriptById(id);
    if (!script || script.userId !== V1_USER_ID) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(script);
  }

  const scripts = await getUserScripts(V1_USER_ID);
  return Response.json(scripts);
}
