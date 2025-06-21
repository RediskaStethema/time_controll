import { model_fire_employee, model_tub_num } from '../../src/model/Employee.js';
import { FiredEmpls_service } from "../../src/services/service_fired_employes/firedEmpls_service.js";
import * as fs from 'fs/promises'; // ✅ корректно

jest.mock('fs/promises', () => ({
    appendFile: jest.fn()
}));

jest.mock('../../src/model/Employee.js', () => ({
    model_fire_employee: {
        findOne: jest.fn(),
        find: jest.fn(),
        findOneAndDelete: jest.fn()
    },
    model_tub_num: {
        findOne: jest.fn()
    }
}));

describe('FiredEmpls_service', () => {
    const service = new FiredEmpls_service();

    test('GetFiredbyID: returns fired employee by ID', async () => {
        (model_fire_employee.findOne as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve({ id: '1', tub_nume: '42' })
        });

        const res = await service.GetFiredbyID('1');
        expect(res).toEqual({ id: '1', tub_nume: '42' });
    });

    test('GetaAllFiredEmployees: returns list', async () => {
        (model_fire_employee.find as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve([{ id: '1' }, { id: '2' }])
        });

        const res = await service.GetaAllFiredEmployees();
        expect(res).toEqual([{ id: '1' }, { id: '2' }]);
    });

    test('GethouresOfFIredEmployees: returns tables', async () => {
        (model_fire_employee.findOne as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve({ id: '1', tub_nume: '77' })
        });
        (model_tub_num.findOne as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve([{ hours: 6 }])
        });

        const res = await service.GethouresOfFIredEmployees('1');
        expect(res).toEqual([{ hours: 6 }]);
    });

    test('GethouresOfFIredEmployees: throws if employee not found', async () => {
        (model_fire_employee.findOne as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve(null)
        });

        await expect(service.GethouresOfFIredEmployees('unknown')).rejects.toThrow('No employee found');
    });

    test('DeleteEmp_From_fired: deletes and logs', async () => {
        const mockResult = { id: '1', tub_nume: '22' };
        (model_fire_employee.findOneAndDelete as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve(mockResult)
        });

        const res = await service.DeleteEmp_From_fired('1');

        expect(res).toEqual(mockResult);
        expect(fs.appendFile).toHaveBeenCalledWith(
            './src/Deleted.log',
            expect.stringContaining('"id":"1"')
        );
    });

    test('DeleteEmp_From_fired: throws if not found', async () => {
        (model_fire_employee.findOneAndDelete as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve(null)
        });

        await expect(service.DeleteEmp_From_fired('unknown')).rejects.toThrow('No employee found');
    });
});

