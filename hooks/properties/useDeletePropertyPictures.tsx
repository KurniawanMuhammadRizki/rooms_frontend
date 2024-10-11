import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../graphQL/graphqlClient";
import { DELETE_PROPERTY_PICTURES } from "@/hooks/graphQL/mutations";

interface DeletePropertyPicturesVariables {
    propertyPictureId: string[];
    email: string;
}

export function useDeletePropertyPictures() {
    const queryClient = useQueryClient();

    return useMutation<string, Error, DeletePropertyPicturesVariables>({
        mutationKey: ["propertyPictures"],
        mutationFn: async ({ propertyPictureId, email }) => {
            const response = await graphqlClient.request<{ deletePropertyPictures: string }>(
                DELETE_PROPERTY_PICTURES,
                { propertyPictureId, email }
            );
            return response.deletePropertyPictures;
        },
        onSuccess: (data) => {
            console.log("Property pictures deleted successfully:", data);
            queryClient.invalidateQueries({ queryKey: ["propertyPictures", "property"] });
            // queryClient.invalidateQueries(['properties']);
        },
        onError: (error) => {
            console.error("Failed to delete property pictures:", error);
        },
    });
}