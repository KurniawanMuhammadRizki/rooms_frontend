"use client";
import React, {useEffect, useState, useCallback} from 'react';
import {useSearchParams} from "next/navigation";
import PictureLayout from "@/app/property-detail/components/pictureLayout";
import Breadcrumbs from "@/app/property-detail/components/breadcrumbs";
import Navigation from "@/app/property-detail/components/navigation";
import LoginAdsPropertyDetail from "./components/loginAdsPropertyDetail";
import Overview from "./components/Overview";
import Review from "./components/Review";
import Rooms from "./components/rooms";
import Description from "./components/description";
import {useGetPropertyBySlug} from "@/hooks/properties/useGetPropertyBySlug";
import {useGetAvailableRooms} from "@/hooks/rooms/useGetAvailableRooms";
import LoadingStateAnimation from "@/components/animations/LoadingStateAnimation";
import {PropertyDetailType} from "@/types/properties/PropertiesDetail";
import {RoomType} from "@/types/rooms/RoomsType";
import useRefetchRooms from "@/hooks/useRefetchRooms";
import DataNotFoundAnimation from "@/components/animations/DataNotFoundAnimation";
import NoSlugError from "@/app/property-detail/components/NoSlugError";


const Page = () => {
    const [slug, setSlug] = useState<string | null>(null);
    const [roomsSearchInput, setRoomsSearchInput] = useState({
        checkinDate: new Date("2024-10-10"),
        checkOutDate: (new Date("2024-10-11")),
        propertyId: ""
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const queryParams = new URLSearchParams(window.location.search);
            const slugParam = queryParams.get("slugs");
            if (slugParam) {
                setSlug(slugParam);
            }
        }
    }, []);

    const {data, isLoading, error} = useGetPropertyBySlug(slug ?? "") as {
        data: PropertyDetailType | null;
        isLoading: boolean;
        error: Error | null;
    };

    const {
        data: availableRoomsData,
        isLoading: roomsLoading,
        error: roomsError,
        refetch: refetchRooms
    } = useGetAvailableRooms(roomsSearchInput);

    const {refetchStatus, setRefetchStatus} = useRefetchRooms({
        refetch: false,
        from: null,
        to: null,
        propertyId :null
    });

    const handleRefetch = () => {
        if (data?.id) {
            setRoomsSearchInput(prev => ({
                ...prev,
                checkinDate: refetchStatus.from || prev.checkinDate,
                checkOutDate: refetchStatus.to || prev.checkOutDate,
                propertyId: data.id
            }));
        }
    }

    useEffect(() => {
        if (refetchStatus.refetch) {
            handleRefetch();
            refetchRooms();
        }
        setRefetchStatus({...refetchStatus, refetch: false});

    }, [refetchStatus]);

    useEffect(() => {
        if (data?.id) {
            setRoomsSearchInput(prev => ({...prev, propertyId: data.id}));
            setRefetchStatus({...refetchStatus, propertyId: data.id})
        }
    }, [data?.id]);


    if (!slug) {
        return <NoSlugError/>;
    }

    if (isLoading) return <div className={""}><LoadingStateAnimation/></div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No property data found</div>;

    return (
        <div className={"px-[180px]"}>
            <div className={"min-h-screen"}>
                <Breadcrumbs data={data as PropertyDetailType}/>
                <PictureLayout data={data}/>
                <LoginAdsPropertyDetail/>
                <Navigation/>
                <Overview data={data}/>
                {roomsLoading ? (
                    <div>Loading rooms...</div>
                ) : roomsError ? (
                    <div>Error loading rooms: {roomsError.message}</div>
                ) : (
                    <Rooms data={availableRoomsData as RoomType[]}/>
                )}
                <Review/>
                <Description data={data}/>
            </div>
        </div>
    );
};

export default Page;