import { openDB } from 'https://cdn.skypack.dev/idb';

const dbPromise = openDB('weatherDB', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('locations')) {
            db.createObjectStore('locations', { keyPath: 'id', autoIncrement: true });
        }
    }
});

export async function saveLocation(name) {
    const db = await dbPromise;
    await db.add('locations', { name });
}

export async function getLocations() {
    const db = await dbPromise;
    return await db.getAll('locations');
}

export async function deleteLocation(id) {
    const db = await dbPromise;
    await db.delete('locations', id);
}
