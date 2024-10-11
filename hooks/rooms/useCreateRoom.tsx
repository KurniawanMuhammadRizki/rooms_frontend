import {useMutation, useQueryClient} from "@tanstack/react-query";
import {graphqlClient} from "../graphQL/graphqlClient";
import {CREATE_ROOM} from "@/hooks/graphQL/mutations";

interface CreateRoomInput {
    input: {
        name: string | null;
        description: string | null;
        capacity: number | null;
        price: number | null;
        propertyId: string | null;
        includeBreakfast: boolean | null;
        bedType: string | null;
        roomArea: number | null;
        numberOfRooms: number | null;
    };
    email: string;
}

export function useCreateRoom() {
    const queryClient = useQueryClient();
    return useMutation<string, Error, CreateRoomInput>({
        mutationKey: ["createRoom"],
        mutationFn: async (variables) => {
            return await graphqlClient.request<string>(
                CREATE_ROOM,
                variables
            );
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["rooms"]});
            console.log("Room created successfully:", data);
        },
        onError: (error) => {
            console.error("Failed to create room:", error);
        },
    });
}
