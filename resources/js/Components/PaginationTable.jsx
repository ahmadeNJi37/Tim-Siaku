import {  Pagination, PaginationContent, PaginationItem,  PaginationLink,  PaginationNext, PaginationPrevious, } from "@/Components/ui/pagination";
  import { cn } from "@/lib/utils";
  
  export default function PaginationTable({ meta, Links }) {
    return (
      <Pagination>
        <PaginationContent className="flex flex-wrap justify-center lg:justify-end">
          <PaginationItem>
            <PaginationPrevious
              className={cn("mb-1", !Links.prev && "cursor-not-allowed")}
              href={Links.prev}
            />
          </PaginationItem>
          {meta.links.slice(1, -1).map((link, index) => (
            <PaginationItem key={index} className="mx-1 mb-1 lg:mb-0">
              <PaginationLink href={link.url} isActive={link.active}>
                {link.label}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              className={cn("mb-1", !Links.next && "cursor-not-allowed")}
              href={Links.next}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
  