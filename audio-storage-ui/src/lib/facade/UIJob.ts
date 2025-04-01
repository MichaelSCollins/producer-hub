/* eslint-disable @typescript-eslint/no-explicit-any */

class UIJob {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jobFunction: (event: any) => void = () => {
    }
    onBefore = () => {
    }
    before = (callback: () => void) => {
        this.onBefore = callback;
        return this;
    }
    onAfter = () => {
    }
    after = (callback: () => void) => {
        this.onAfter = callback;
        return this;
    }
    onError = (error: string) => {
        console.error(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    onSuccess = (data: any) => {
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success = (callback: (data: any) => void) => {
        this.onSuccess = callback;
        return this;
    }
    error = (callback: (error: string) => void) => {
        this.onError = callback;
        return this;
    }
    setJobFunction = (func: any) => {
        this.jobFunction = func;
        return this;
    }
    execute = async (e: any) => {
        try
        {
            this.onBefore();
            const response = await this.jobFunction(e);
            this.onSuccess(response);
        } catch (err: unknown)
        {
            if (err instanceof Error)
            {
                this.onError(err.message);
            } else
            {
                this.onError('An unknown error occurred');
            }
        } finally
        {
            this.onAfter();
        }
    }
}
export default UIJob;