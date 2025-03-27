import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ContactRound } from 'lucide-react';
import { Team } from '@/mock-data/teams';

interface TeamsTooltipProps {
   teams: Team[];
}

export function TeamsTooltip({ teams }: TeamsTooltipProps) {
   const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

   useEffect(() => {
      async function fetchTeams() {
         const allTeams = teams;
         setFilteredTeams(allTeams.filter((team) => teams.some((t) => t.team_id === team.team_id)));
      }
      fetchTeams();
   }, [teams]);

   return (
      <Tooltip delayDuration={0}>
         <TooltipTrigger className="flex items-center gap-0.5 truncate">
            <ContactRound className="text-muted-foreground size-4 mr-1 shrink-0" />
            {teams &&
               teams.slice(0, 2).map((team, index) => (
                  <span key={team.team_id} className="mt-0.5">
                     {team.name}
                     {index < Math.min(teams.length, 2) - 1 && ', '}
                  </span>
               ))}
            {teams && teams.length > 2 && <span className="mt-0.5">+ {teams.length - 2}</span>}
         </TooltipTrigger>
         <TooltipContent className="p-2">
            <div className="flex flex-col gap-1">
               {filteredTeams.map((team) => (
                  <div key={team.team_id} className="text-xs flex items-center gap-2">
                     <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                        <div className="text-sm">{team.icon}</div>
                     </div>
                     <span className="font-medium">{team.name}</span>
                  </div>
               ))}
            </div>
         </TooltipContent>
      </Tooltip>
   );
}
