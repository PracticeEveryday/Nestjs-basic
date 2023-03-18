import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (incomePassword: string, userPassword: string): Promise<boolean> => {
    return await bcrypt.compare(incomePassword, userPassword);
};
