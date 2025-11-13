import { formatName, getFullName } from "@/utils/commonFunction";

interface Props {
  row: any;
  onlyImage?: boolean;
  onlyName?: boolean;
}

export default function UserProfile({
  row,
  onlyImage = false,
  onlyName = false,
}: Props) {
  const image = row.original?.createdByData && (
    <img
      src={
        row.original.createdByData.profileUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          row.original.createdByData.firstName +
            " " +
            row.original.createdByData.lastName
        )}`
      }
      alt={row.original.createdByData.fullName}
      className="h-8 w-8 rounded-full object-cover"
    />
  );

  const name = (
    <span className="block my-auto">
      {formatName(
        getFullName(
          row.original?.createdByData.firstName,
          row.original?.createdByData?.lastName
        )
      )}
    </span>
  );

  return (
    <>
        {(!onlyImage && !onlyName) ? (
            <>{image}{name}</>
        ): (
            <>
                {onlyImage ? image: null}
                {onlyName ? name: null}
            </>
        )}
    </>
  );
}
