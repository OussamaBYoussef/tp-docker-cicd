// __tests__/api.test.js
const request = require('supertest');
const app = require('../server');

// Mock de la base de données
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const { Pool } = require('pg');
const pool = new Pool();

describe('Endpoints API', () => {
  // Réinitialise le mock avant chaque test
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('GET /api retourne un message', (done) => {
    request(app)
      .get('/api')
      .expect(200)
      .expect((res) => {
        if (!res.body.success) throw new Error('success false');
        if (!res.body.message.includes('Hello')) throw new Error('pas de Hello');
      })
      .end(done);
  });

  it('GET /db retourne des données', (done) => {
    // Simule une réponse de la DB
    pool.query.mockResolvedValue({
      rows: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
      ]
    });

    request(app)
      .get('/db')
      .expect(200)
      .expect((res) => {
        if (!Array.isArray(res.body.data)) throw new Error('data pas un tableau');
        if (res.body.data.length !== 2) throw new Error('pas 2 éléments');
      })
      .end(done);
  });
});
