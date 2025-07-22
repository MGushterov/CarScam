import AnnSmall from './AnnSmall';

const AnnSection = ({ announcements }) => {
    console.log(announcements)

    return (
        <div className='h-[60%] w-full grid max-sm:grid-cols-1 grid-cols-2 gap-8 bg-zinc-100 p-4 overflow-y-scroll'>
            {announcements.map(ann => (
                <AnnSmall 
                    announcementId={ann.announcementId}
                    userId={ann.userId}
                    make={ann.vehicleMake}
                    price={ann.price}
                    manufactureYear={ann.vehicleYear}
                    engine={ann.engine}
                    photo={ann.photos[0]}
                />
            ))}
        </div>
    );
}

export default AnnSection;