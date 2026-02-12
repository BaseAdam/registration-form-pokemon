import { NextApiRequest, NextApiResponse } from 'next';

import handler from '@/pages/api/search';

const createMockReq = (
  query: Record<string, string | string[]>,
  method: string = 'GET'
): NextApiRequest => {
  return {
    method,
    query,
  } as NextApiRequest;
};

const createMockRes = (): NextApiResponse => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse;
  return res;
};

describe('/api/search', () => {
  it('should return empty array when name is not provided', async () => {
    const req = createMockReq({});
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  it('should return empty array when name is empty string', async () => {
    const req = createMockReq({ name: '' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  it('should return search results when name matches', async () => {
    const req = createMockReq({ name: 'pikachu' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall.data).toBeDefined();
    expect(Array.isArray(jsonCall.data)).toBe(true);
    expect(jsonCall.data.length).toBeGreaterThan(0);
    expect(jsonCall.data[0].item.name).toBe('pikachu');
  });

  it('should return 404 when no pokemons found', async () => {
    const req = createMockReq({ name: 'nonexistentpokemon123' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No pokemons found' });
  });

  it('should return 405 for non-GET methods', async () => {
    const req = createMockReq({ name: 'pikachu' }, 'POST');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });
});
