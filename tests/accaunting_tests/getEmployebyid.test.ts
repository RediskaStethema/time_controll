import { Account_imbd_impl } from '../../src/services/AccountingService/AccountingService.js';
import {
    model_EMPLOYEE,
    model_fire_employee,
    model_tub_num
} from '../../src/model/Employee.js';

import * as bcrypt from 'bcrypt';
jest.mock('../../src/model/Employee.js', () => ({
    model_EMPLOYEE: {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        find: jest.fn(),
        deleteOne: jest.fn()
    },
    model_fire_employee: jest.fn((data: any) => ({
        ...data,
        save: jest.fn().mockResolvedValue(undefined),
        toObject: () => data
    })),
    model_tub_num: {
        find: jest.fn()
    }
}));


jest.mock('bcrypt', () => ({
    compareSync: jest.fn(),
    hashSync: jest.fn(() => 'hashed-password'),
    genSaltSync: jest.fn(() => 'salt')
}));





jest.mock('../../src/utils/tools', () => ({
    getJWT: jest.fn(() => 'mocked-jwt-token')
}));

describe('Account_imbd_impl', () => {
    const service = new Account_imbd_impl();

    test('getEmployebyID: throws when employee not found', async () => {
        (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        await expect(service.getEmployeebyID("unknown")).rejects.toThrow('Employee not found');
    });

    test('changePassword: updates password hash', async () => {
        (model_EMPLOYEE.findOneAndUpdate as jest.Mock).mockResolvedValue({ id: '1' });

        await service.changePassword('1', 'newpass123');

        expect(model_EMPLOYEE.findOneAndUpdate).toHaveBeenCalledWith(
            { id: '1' },
            expect.objectContaining({
                $set: { hash: expect.any(String) },
            })
        );
    });
    test('getAllEmployees: returns employees', async () => {
        (model_EMPLOYEE.find as jest.Mock).mockReturnValue({
            lean: () => Promise.resolve([{ id: '1' }, { id: '2' }])
        });

        const service = new Account_imbd_impl();
        const res = await service.getAllEmployees();
        expect(res).toEqual([{ id: '1' }, { id: '2' }]);
    });

    test('LOGIN: throws if password invalid', async () => {
        const mockUser = { id: '1', hash: 'hashed', roles: ['user'] };

        const service = new Account_imbd_impl();
        jest.spyOn(service, 'getEmployeebyID').mockResolvedValue(mockUser as any);
        jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

        await expect(service.LOGIN({ id: '1', password: 'wrong' })).rejects.toThrow(/invalid password/);
    });
    test('LOGIN: returns token on success', async () => {
        const mockUser = { id: '1', hash: 'hashed', roles: ['user'] };

        const service = new Account_imbd_impl();
        jest.spyOn(service, 'getEmployeebyID').mockResolvedValue(mockUser as any);
        jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

        const res = await service.LOGIN({ id: '1', password: 'correct' });
        expect(res).toBe('mocked-jwt-token');
    });

    test('Get_houres_Of_employees: returns table entries', async () => {
        const mockEmployee = { id: '1', table_num: '42' };
        const mockTables = [{ hours: 5 }];

        const service = new Account_imbd_impl();
        jest.spyOn(service, 'getEmployeebyID').mockResolvedValue(mockEmployee as any);
        (model_tub_num.find as jest.Mock).mockResolvedValue(mockTables);

        const res = await service.Get_houres_Of_employees('1');
        expect(res).toEqual(mockTables);
    });
    test('updateEmployee: throws if employee not found', async () => {
        (model_EMPLOYEE.findOne as jest.Mock).mockResolvedValue(null);

        const dto = { id: '1', firstName: 'John', lastName: 'Doe' };
        const service = new Account_imbd_impl();
        await expect(service.updateEmployee(dto as any)).rejects.toThrow('Employee not found');
    });
});

