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
            <DialogContent className="sm:max-w-md">
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
                            <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
                                <img className="w-full h-64 object-cover" src={data?.Poster} alt="xXx Poster" />
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{data.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4">
                                        <span className="font-semibold">Director:</span> Rob Cohen
                                    </p>
                                    <p className="text-gray-600 text-sm mb-4">
                                        <span className="font-semibold">Genre:</span> Action, Adventure, Drama
                                    </p>
                                    <p className="text-gray-700 text-sm mb-4">
                                        The US government recruits extreme sports athlete Xander Cage to infiltrate a
                                        Russian criminal ring, which is plotting the destruction of the world.
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                        <span>
                                            <span className="font-semibold">Runtime:</span> 124 min
                                        </span>
                                        <span>
                                            <span className="font-semibold">Rated:</span> PG-13
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>
                                            <span className="font-semibold">IMDb:</span> 5.8/10
                                        </span>
                                        <span>
                                            <span className="font-semibold">Box Office:</span> $142M
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-500 text-xs italic">
                                            Awards: 4 wins & 14 nominations total
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                            Learn More
                                        </button>
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
