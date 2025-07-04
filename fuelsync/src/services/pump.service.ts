import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { beforeCreatePump } from '../middleware/planEnforcement';
import { parseRows } from '../utils/parseDb';

export async function createPump(db: Pool, tenantId: string, stationId: string, name: string, serialNumber?: string): Promise<string> {
  const client = await db.connect();
  try {
    // Enforce plan limits using tenant id
    await beforeCreatePump(client, tenantId, stationId);

    const res = await client.query<{ id: string }>(
      'INSERT INTO public.pumps (id, tenant_id, station_id, name, serial_number, updated_at) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING id',
      [randomUUID(), tenantId, stationId, name, serialNumber || null]
    );
    return res.rows[0].id;
  } finally {
    client.release();
  }
}

export async function listPumps(db: Pool, tenantId: string, stationId?: string) {
  const where = stationId ? 'WHERE p.station_id = $1' : '';
  const params = stationId ? [stationId, tenantId] : [tenantId];
  const res = await db.query(
    `SELECT p.id, p.station_id, p.name, p.serial_number, p.status, p.created_at,
     (SELECT COUNT(*) FROM public.nozzles n WHERE n.pump_id = p.id) as nozzle_count
     FROM public.pumps p WHERE p.tenant_id = $${stationId ? 2 : 1} ${where ? 'AND ' + where : ''} ORDER BY p.name`,
    params
  );
  return parseRows(
    res.rows.map(row => ({
      ...row,
      nozzleCount: parseInt(row.nozzle_count)
    }))
  );
}

export async function deletePump(db: Pool, tenantId: string, pumpId: string) {
  const count = await db.query('SELECT COUNT(*) FROM public.nozzles WHERE pump_id = $1 AND tenant_id = $2', [pumpId, tenantId]);
  if (Number(count.rows[0].count) > 0) {
    throw new Error('Cannot delete pump with nozzles');
  }
  await db.query('DELETE FROM public.pumps WHERE id = $1 AND tenant_id = $2', [pumpId, tenantId]);
}

export async function updatePump(
  db: Pool,
  tenantId: string,
  pumpId: string,
  name?: string,
  serialNumber?: string
) {
  const updates = [] as string[];
  const params = [pumpId, tenantId];
  let idx = 2;

  if (name !== undefined) {
    updates.push(`name = $${idx}`);
    params.push(name);
    idx++;
  }

  if (serialNumber !== undefined) {
    updates.push(`serial_number = $${idx}`);
    params.push(serialNumber);
    idx++;
  }

  if (updates.length === 0) return;

  await db.query(
    `UPDATE public.pumps SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $1 AND tenant_id = $2`,
    params
  );
}
