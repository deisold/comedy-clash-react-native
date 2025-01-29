import { useEffect } from "react";
import { ViewModelEventEmitter, ViewModelEvents } from "../../../utils/CommonEvents";
import { showToastSuccess, showToastError } from "../../../utils/utils"; // Import directly

export const useEventEmitter = (eventEmitter: ViewModelEventEmitter) => {
    useEffect(() => {
        const handleSuccess = (event: ViewModelEvents) => {
            console.log(`handleSuccess: ${event.message}`);
            showToastSuccess(event.message);
        };

        const handleError = (event: ViewModelEvents) => {
            console.log(`handleError: ${event.message}`);
            showToastError(event.message);
        };

        // Attach the listeners
        eventEmitter.on('success', handleSuccess);
        eventEmitter.on('error', handleError);

        // Cleanup function to remove listeners
        return () => {
            eventEmitter.removeAllListeners();
        };
    }, [eventEmitter]); // Only eventEmitter as a dependency
}