import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import client from "../prisma/client";
import { Service } from "../prisma/prisma.types";

const getServiceByName = async (name: string) => {
    return await client.service.findUnique({ where: { name: name.toLowerCase() } });
};

const getServiceById = async (id: string) => {
    return await client.service.findUnique({ where: { id } });
};

const getServices = async () => {
    return await client.service.findMany();
};

const createService = async (data: Omit<Service, "id" | "createdAt" | "updatedAt" | "lastNotified">) => {
    return await client.service.create({ data: {
        ...data,
        name: data.name.toLowerCase(),
        id: `srv_${createId()}`,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        lastNotified: null,
    } });
};

const updateService = async ({
    id,
    name,
    data,
}: {
    id?: string;
    name?: string;
    data: Partial<Omit<Service, "id">>;
}) => {
    if (!id && !name) {
        throw new Error("Either id or name must be provided");
    }
    const where: Prisma.ServiceWhereUniqueInput = id ? { id } : { name: name?.toLowerCase() };
    return await client.service.update({ 
        where, 
        data: {
            ...data,
            updatedAt: new Date()
        } 
    });
};

const deleteService = async ({ id, name }: { id: string; name: string }) => {
    return await client.service.delete({ where: { id, name: name.toLowerCase() } });
};

const getUsageByName = async (name: string) => {
    return await client.service.findUnique({ where: { name: name.toLowerCase() }, select: { currentUsage: true } });
};

export default { getByName: getServiceByName, getById: getServiceById, getAll: getServices, create: createService, update: updateService, delete: deleteService, getUsageByName };
