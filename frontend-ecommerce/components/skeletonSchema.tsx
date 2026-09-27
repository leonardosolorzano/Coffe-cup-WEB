import { Skeleton } from "./ui/skeleton";

type SkeletonSchemaProps = {
  grid: number;
};

const SkeletonSchema = ({ grid }: SkeletonSchemaProps) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando productos"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: grid }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonSchema;
