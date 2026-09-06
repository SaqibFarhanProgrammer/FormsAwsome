"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useDispatch, useSelector } from "react-redux";
import { updateFormMeta } from "@/redux/features/form-builder/form.slice";
import {
  selectFormTitle,
  selectFormDescription,
} from "@/redux/features/form-builder/form.selectors";

/**
 * FormMeta Component
 *
 * Handles form title and description input.
 *
 * Redux Subscriptions:
 * - formTitle (via selectFormTitle)
 * - formDescription (via selectFormDescription)
 *
 * Re-renders only when title or description change, not when fields change.
 */
export function FormMeta() {
  const dispatch = useDispatch();
  const title = useSelector(selectFormTitle);
  const description = useSelector(selectFormDescription);

  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="space-y-3 flex-1">
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  dispatch(
                    updateFormMeta({
                      title: e.target.value,
                    }),
                  );
                }}
                className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/60 text-foreground"
                placeholder="Form Title"
              />
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary/30 rounded-full" />
            </div>

            <input
              type="text"
              value={description}
              onChange={(e) => {
                dispatch(
                  updateFormMeta({
                    description: e.target.value,
                  }),
                );
              }}
              className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-muted-foreground"
              placeholder="Form description (optional)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
