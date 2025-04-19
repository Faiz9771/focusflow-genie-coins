
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TimerSettingsProps {
  workDuration: number;
  breakDuration: number;
  onSave: (workDuration: number, breakDuration: number) => void;
  onCancel: () => void;
}

const TimerSettings = ({ workDuration, breakDuration, onSave, onCancel }: TimerSettingsProps) => {
  const [newWorkDuration, setNewWorkDuration] = React.useState(workDuration);
  const [newBreakDuration, setNewBreakDuration] = React.useState(breakDuration);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-focusflow-purple">
            Timer Settings ⚙️
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8 py-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Work Duration: {newWorkDuration} minutes
            </label>
            <Slider
              value={[newWorkDuration]}
              onValueChange={(value) => setNewWorkDuration(value[0])}
              min={5}
              max={60}
              step={5}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">
              Break Duration: {newBreakDuration} minutes
            </label>
            <Slider
              value={[newBreakDuration]}
              onValueChange={(value) => setNewBreakDuration(value[0])}
              min={1}
              max={30}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-2 border-focusflow-purple hover:bg-focusflow-purple hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave(newWorkDuration, newBreakDuration)}
              className="bg-focusflow-purple hover:bg-focusflow-purple/90"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerSettings;
