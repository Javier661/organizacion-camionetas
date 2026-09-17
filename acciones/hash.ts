"use server";
import bcrypt from 'bcrypt';
export const hachearContraseña = async (contraseña : string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
    return hashedPassword;
}