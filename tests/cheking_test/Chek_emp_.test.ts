import { model_EMPLOYEE } from '../../src/model/Employee.js';
import { Service_of_imd_shift } from '../../src/services/service_shift/Service_of_imd_shift.js';
import {model_tub_num} from "../../src/model/Chekin_employees.js";

jest.mock('../../src/model/Employee.js', () => ({
    model_EMPLOYEE: {
        findOne: jest.fn(),
    },
    model_tub_num: {
        findOneAndUpdate: jest.fn(),
        create: jest.fn(),
    }
}));

describe('Service_of_imd_shift', () => {
    const service = new Service_of_imd_shift();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('end_of_work', () => {
        it('should update time_End and return table entry', async () => {
            const mockEmployee = { table_num: '123' };
            const mockTable = {
                save: jest.fn(),
            };

            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockEmployee)
            });

            (model_tub_num.findOneAndUpdate as jest.Mock).mockResolvedValue(mockTable);

            const result = await service.end_of_work('emp1');

            expect(model_EMPLOYEE.findOne).toHaveBeenCalledWith({ id: 'emp1' });
            expect(model_tub_num.findOneAndUpdate).toHaveBeenCalledWith(
                { table_num: mockEmployee.table_num, Day: expect.any(String) },
                expect.objectContaining({ $set: { time_End: expect.any(String) } }),
                { new: true }
            );
            expect(mockTable.save).toHaveBeenCalled();
            expect(result).toBe(mockTable);
        });

        it('should throw if employee not found', async () => {
            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            await expect(service.end_of_work('emp1')).rejects.toThrow('incorrect employee id');
        });

        it('should throw if table entry not found', async () => {
            const mockEmployee = { table_num: '123' };
            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockEmployee)
            });
            (model_tub_num.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(service.end_of_work('emp1')).rejects.toThrow('Employee not found');
        });
    });

    describe('start_of_work', () => {
        it('should create a new work start entry and return true', async () => {
            const mockEmployee = { table_num: '123' };

            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockEmployee)
            });

            (model_tub_num.create as jest.Mock).mockResolvedValue({});

            const result = await service.start_of_work('emp1');

            expect(model_EMPLOYEE.findOne).toHaveBeenCalledWith({ id: 'emp1' });
            expect(model_tub_num.create).toHaveBeenCalledWith(expect.objectContaining({
                table_num: '123',
                Day: expect.any(String),
                time_Start: expect.any(String),
                time_End: ' ',
            }));
            expect(result).toBe(true);
        });

        it('should throw if employee not found', async () => {
            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            await expect(service.start_of_work('emp1')).rejects.toThrow('incorrect employee id');
        });

        it('should throw if create returns falsy', async () => {
            const mockEmployee = { table_num: '123' };
            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockEmployee)
            });
            (model_tub_num.create as jest.Mock).mockResolvedValue(null);

            await expect(service.start_of_work('emp1')).rejects.toThrow('No employee no created');
        });
    });

    describe('employ_on_salary', () => {
        it('should create a fixed salary work entry and return true', async () => {
            const mockEmployee = { table_num: '123' };

            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockEmployee)
            });

            (model_tub_num.create as jest.Mock).mockResolvedValue({});

            const result = await service.employ_on_salary('emp1');

            expect(model_EMPLOYEE.findOne).toHaveBeenCalledWith({ id: 'emp1' });
            expect(model_tub_num.create).toHaveBeenCalledWith(expect.objectContaining({
                table_num: '123',
                Day: expect.any(String),
                time_Start: 'Fixed',
                time_End: 'Fixed',
            }));
            expect(result).toBe(true);
        });

        it('should throw if employee not found', async () => {
            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });

            await expect(service.employ_on_salary('emp1')).rejects.toThrow('incorrect employee id');
        });

        it('should throw if create returns falsy', async () => {
            const mockEmployee = { table_num: '123' };
            (model_EMPLOYEE.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockEmployee)
            });
            (model_tub_num.create as jest.Mock).mockResolvedValue(null);

            await expect(service.employ_on_salary('emp1')).rejects.toThrow('No employee no created');
        });
    });
});
