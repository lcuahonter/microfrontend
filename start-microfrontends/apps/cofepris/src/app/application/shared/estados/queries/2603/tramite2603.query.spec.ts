import { Tramite2603Query } from './tramite2603.query';
import { Tramite2603Store } from '../../stores/2603/tramite2603.store';

describe('Tramite2603Query', () => {
	let store: Tramite2603Store;
	let query: Tramite2603Query;

	beforeEach(() => {
		store = {
			select: jest.fn((fn) => fn({ test: 'state' })),
		} as any;
		query = new Tramite2603Query(store);
	});

	it('should be created', () => {
		expect(query).toBeTruthy();
	});

	it('should selectSolicitud$ return state', () => {
		const result = query.selectSolicitud$;
		expect(result).toEqual({ test: 'state' });
	});
});
