"use client";

import { getCategoriesAction } from "@/lib/actions/category/category-action";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { Label } from "@workspace/ui/components/label";

interface Props {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const CategoryFilter = ({ onChange, value }: Props) => {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });

  const handleCheckedChange = (slug: string, checked: boolean) => {
    if (checked) {
      onChange([...(value || []), slug]);
    } else {
      onChange((value || []).filter((v) => v !== slug));
    }
  };

  return (
    <div className="space-y-3">
      <Label>Categories</Label>

      <div className="space-y-2">
        {data?.categories?.map((item) => {
          const checked = value?.includes(item.slug) ?? false;

          return (
            <Field orientation="horizontal" key={item.id}>
              <Checkbox
                id={item.slug}
                name={item.slug}
                checked={checked}
                onCheckedChange={(c) =>
                  handleCheckedChange(item.slug, Boolean(c))
                }
              />

              {/* Clicking label will toggle checkbox automatically */}
              <FieldLabel htmlFor={item.slug}>{item.name}</FieldLabel>
            </Field>
          );
        })}
      </div>
    </div>
  );
};
