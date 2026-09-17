"use client"
import { useState } from 'react';
import {hachearContraseña} from '@/acciones/hash';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export default function AgregarPersonal() {
    const [contraseña, setContraseña] = useState<string>("");   
    const [contraseñaHacheada, setContraseñaHacheada] = useState<string>("");
    const [error, setError] = useState<string>("");
    const devolverHash = async () => {
        if(!contraseña) {
            setError("La contraseña no puede estar vacía.");
            return;
        };
        setError("");
        const hash = await hachearContraseña(contraseña);
        setContraseñaHacheada(hash);
    }
    return (
        <div>
            <Label>Hachear Contraseña</Label>
            <Input 
                type="password"
                placeholder="Contraseña a hachear"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
            />
            <Button onClick={devolverHash}>Hachear</Button>
            {contraseñaHacheada ? (
                <p>Contraseña hacheada: {contraseñaHacheada}</p>
            ): (
                <p>{error}</p>
            )}
        </div>
    )
}