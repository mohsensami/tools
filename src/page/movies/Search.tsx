import Spinner from '@/components/Spinner';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const Search = ({ serachBtnRef, data, loading }: any) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button ref={serachBtnRef}></button>
            </DialogTrigger>
            <DialogContent className="">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>{data?.Title}</DialogTitle>
                            <DialogDescription>{data?.Plot}</DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="  bg-white rounded-2xl shadow-md overflow-hidden">
                                <div className="grid grid-cols-3">
                                    <div className="col-span-1">
                                        <img className="w-full  " src={data?.Poster} alt={data.title} />
                                    </div>
                                    <div className="col-span-2 p-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{data.title}</h2>
                                        <p className="text-gray-600 text-sm mb-4">
                                            <span className="font-semibold">Director:</span> {data.Director}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-4">
                                            <span className="font-semibold">Genre:</span> {data.Genre}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-4">{data.Plot}</p>
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                            <span>
                                                <span className="font-semibold">Runtime:</span> {data.Runtime}
                                            </span>
                                            <span>
                                                <span className="font-semibold">Rated:</span> {data.Rated}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>
                                                <span className="font-semibold">IMDb:</span>{' '}
                                                <span className="text-green-600">{data.imdbRating}</span>/10
                                            </span>
                                            <span>
                                                <span className="font-semibold">Box Office:</span> {data.BoxOffice}
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-gray-500 text-xs italic">Awards: {data.Awards}</p>
                                        </div>
                                        <div className="mt-6">
                                            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                                See More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <button type="button">Close</button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Search;
