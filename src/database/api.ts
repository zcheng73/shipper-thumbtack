const API_BASE = process.env.VITE_API_URL || 'http://localhost:3001/api';

export async function testDatabaseConnection() {
  try {
    const response = await fetch(`${API_BASE}/db-test`);
    const data = await response.json();
    return { success: data.success, error: null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getEntities(entityType: string) {
  try {
    const response = await fetch(`${API_BASE}/entities/${entityType}`);
    if (!response.ok) throw new Error('Failed to fetch entities');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function createEntity(entityType: string, data: any) {
  try {
    const response = await fetch(`${API_BASE}/entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity_type: entityType, data }),
    });
    if (!response.ok) throw new Error('Failed to create entity');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateEntity(id: number, data: any) {
  try {
    const response = await fetch(`${API_BASE}/entities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) throw new Error('Failed to update entity');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteEntity(id: number) {
  try {
    const response = await fetch(`${API_BASE}/entities/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete entity');
    return await response.json();
  } catch (error) {
    throw error;
  }
}